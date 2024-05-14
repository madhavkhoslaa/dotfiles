// Uncomment this block to pass the first stage
// use std::net::TcpListener;

use std::{
    io::{Read, Write},
    net::TcpListener,
    thread,
};

use redis_starter_rust::{command::command::Command, commands_handlers::ping};

fn main() {
    // You can use print statements as follows for debugging, they'll be visible when running tests.
    println!("Logs from your program will appear here!");

    // Uncomment this block to pass the first stage
    //
    let listener = TcpListener::bind("127.0.0.1:6379").unwrap();

    for stream in listener.incoming() {
        thread::spawn(|| match stream {
            Ok(mut _stream) => {
                let mut buffer = [0; 1024];
                println!("accepted new connection");
                while let Ok(_) = _stream.read(&mut buffer) {
                    println!("RESP Arg: {}", String::from_utf8_lossy(&buffer));
                    let command_object: Command =
                        Command::Parse(String::from_utf8_lossy(&buffer).to_string()).unwrap();
                    println!("{:?}", command_object);
                    ping::ping(&mut _stream);
                }
            }
            Err(_) => todo!(),
        });
    }
}
