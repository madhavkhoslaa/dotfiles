// Uncomment this block to pass the first stage
// use std::net::TcpListener;

use std::{
    hash::Hash,
    io::{Read, Write},
    net::TcpListener,
    thread,
};

use redis_starter_rust::{
    command::command::Command,
    commands_handlers::{ping, Icommand},
    inMemory::db::db,
};

fn main() {
    // You can use print statements as follows for debugging, they'll be visible when running tests.
    println!("Logs from your program will appear here!");

    // Uncomment this block to pass the first stage
    //
    let ctx = db::new();
    let listener = TcpListener::bind("127.0.0.1:6379").unwrap();
    for stream in listener.incoming() {
        thread::spawn(move || match stream {
            Ok(mut _stream) => {
                let mut buffer = [0; 1024];
                println!("accepted new connection");
                while let Ok(_) = _stream.read(&mut buffer) {
                    println!("RESP Arg: {}", String::from_utf8_lossy(&buffer));
                    let command_object: Command =
                        Command::Parse(String::from_utf8_lossy(&buffer).to_string()).unwrap();
                    println!("{:?}", command_object);
                    let handler = command_object.handle(&mut _stream, &mut ctx.clone());
                }
            }
            Err(_) => todo!(),
        });
    }
}
