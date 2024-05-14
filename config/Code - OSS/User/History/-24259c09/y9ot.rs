use anyhow::{Error, Ok};
use hex::ToHex;
use reqwest;
use serde::{Deserialize, Serialize};
use serde_bencode::de;
use serde_json::{self, json};
use sha1::{Digest, Sha1};
use std::{collections::HashMap, env, fs, hash};
// Available if you need it!
// use serde_bencode
enum Bencode {
    String(String),
    Integer(isize),
    List(Vec<Bencode>),
    Dict(HashMap<String, Bencode>),
}

#[derive(Deserialize, Serialize, Debug)]
struct torrentFile {
    announce: String,
    info: infoStruct,
}

#[derive(Deserialize, Serialize, Debug)]
struct infoStruct {
    length: usize,
    name: String,
    #[serde[rename = "piece length"]]
    peice_length: usize,
    #[serde(with = "serde_bytes")]
    pieces: Vec<u8>,
}

fn load_torrent_file(path: &String) -> Result<torrentFile, Error> {
    let contents = std::fs::read(path)?;
    let torrent: torrentFile = serde_bencode::from_bytes(&contents)?;
    Ok(torrent)
}


impl Bencode {
    fn to_json(&self) -> serde_json::Value {
        match self {
            Bencode::String(s) => serde_json::Value::String(s.clone()),

            Bencode::Integer(i) => serde_json::Value::Number(serde_json::Number::from(*i)),

            Bencode::List(l) => {
                let mut result = serde_json::Value::Array(Vec::new());

                for bencode in l {
                    result.as_array_mut().unwrap().push(bencode.to_json());
                }

                result
            }
            Bencode::Dict(m) => {
                let mut result = serde_json::Value::Object(serde_json::Map::new());

                for (key, value) in m {
                    result
                        .as_object_mut()
                        .unwrap()
                        .insert(String::from(key), value.to_json());
                }

                result
            }
        }
    }
}

#[allow(dead_code)]
fn decode_bencoded_value(encoded_value: &str) -> (Bencode, &str) {
    // If encoded_value starts with a digit, it's a number
    if encoded_value.chars().next().unwrap().is_digit(10) {
        // Example: "5:hello" -> "hello"
        let colon_index = encoded_value.find(':').unwrap();
        let number_string = &encoded_value[..colon_index];
        let number = number_string.parse::<i64>().unwrap();
        let string = &encoded_value[colon_index + 1..colon_index + 1 + number as usize];
        return (
            Bencode::String(String::from(string)),
            &encoded_value[colon_index + 1 + number as usize..],
        );
    }
    if encoded_value.chars().nth(0).unwrap() == 'i' {
        let end_index = encoded_value.find('e').unwrap();
        let number_value = &encoded_value[1..end_index];
        return (
            Bencode::Integer(number_value.parse::<isize>().unwrap()),
            &encoded_value[end_index + 1..],
        );
    }
    if encoded_value.chars().nth(0).unwrap() == 'l' {
        let mut list: Vec<Bencode> = Vec::new();

        let mut remaining = &encoded_value[1..];

        while remaining.chars().next().unwrap() != 'e' {
            let (decoded_value, new_remaining) = decode_bencoded_value(remaining);

            list.push(decoded_value);

            remaining = new_remaining;
        }

        return (Bencode::List(list), &remaining[1..]);
    }
    if encoded_value.chars().next().unwrap() == 'd' {
        // Example: "d3:foo3:bar5:helloi52ee" -> {"foo":"bar","hello":52}

        let mut dict: HashMap<String, Bencode> = HashMap::new();

        let mut remaining = &encoded_value[1..];

        while remaining.chars().next().unwrap() != 'e' {
            let (key, new_remaining) = decode_bencoded_value(remaining);

            let key = match key {
                Bencode::String(s) => s,

                _ => panic!("Key must be a string!"),
            };

            let (value, new_remaining) = decode_bencoded_value(new_remaining);

            dict.insert(key, value);

            remaining = new_remaining;
        }

        return (Bencode::Dict(dict), &remaining[1..]);
    } else {
        panic!("Unhandled case encountered: {}", encoded_value)
    }
}

fn calculate_info_hash(torrent: &torrentFile) -> String {
    let mut hasher = Sha1::new();
    hasher.update(serde_bencode::to_bytes(&torrent.info).unwrap());
    format!("{:x}", hasher.finalize())
}

// fn calculate_piece_hash(torrent: &torrentFile) -> Vec<String> {
//     let mut piece_hashes: Vec<String> = Vec::new();
//     for piece in torrent.info.pieces.iter() {
//         piece_hashes.push(format!("{}", hex::encode(piece)));
//     }
//     return piece_hashes;
// }
// Usage: your_bittorrent.sh decode "<encoded_value>"

fn urlencode(t: &[u8]) -> String {
    let mut encoded = String::with_capacity(3 * 20);

    for &byte in t {
        encoded.push('%');
        encoded.push_str(&hex::encode(&[byte]));
    }
    encoded
}

fn string_to_20_bytes_binary(input: Vec<u8>) -> String {
    // Create a Sha256 hash function
    let mut hasher = Sha1::new();
    // Update the hash function with the input string
    hasher.update(input);
        // Get the hash result as a string
    let hash_result = format!("{:02x}",hasher.finalize());

    // Take the first 20 characters of the hash result
    let result = hash_result.chars().take(20).collect::<String>();

    result
}
fn main() {
    let args: Vec<String> = env::args().collect();
    let command = &args[1];
    if command == "decode" {
        // You can use print statements as follows for debugging, they'll be visible when running tests.
        // println!("Logs from your program will appear here!");

        // Uncomment this block to pass the first stage
        let encoded_value = &args[2];
        let decoded_value = decode_bencoded_value(encoded_value).0;

        println!("{}", decoded_value.to_json().to_string());
    } else if command == "info" {
        // read file to string
        // pass to decode function
        // console out the file
        let torrent = load_torrent_file(&args[2]).unwrap();
        println!("Tracker URL: {}", torrent.announce);
        println!("Length: {}", torrent.info.length);
        println!("Info Hash: {}", calculate_info_hash(&torrent));
        println!("Piece Length: {}", torrent.info.peice_length);
        println!("Piece Hashes:");
        println!("Piece Hashs:");
        let mut hasher = Sha1::new();
        hasher.update(serde_bencode::to_bytes(&torrent.info).unwrap());
        let hash = hasher.finalize();
        torrent
            .info
            .pieces
            .chunks(20)
            .map(|chunk| chunk.encode_hex())
            .for_each(|hash: String| println!("{}", hash));
    } else if command == "peers" {
        let torrent = load_torrent_file(&args[2]).unwrap();
        let params = [
            ("peer_id", "00112233445566778899"),
            ("port", "6881"),
            ("info_hash", &serde_urlencoded::ser::to_string(string_to_20_bytes_binary(serde_bencode::to_bytes(&torrent.info).unwrap())).unwrap()),
            ("uploaded", "0"),
            ("downloaded", "0"),
            ("left", &torrent.info.peice_length.to_string()),
            ("compact", "1"),
        ];
        let url = reqwest::Url::parse_with_params(&torrent.announce, &params);
        println!("url: {}", url.clone().unwrap());
        let res = reqwest::blocking::get(url.unwrap());
        println!("{:?}", res.unwrap().text());
    } else {
        println!("unknown command: {}", args[1])
    }
}
