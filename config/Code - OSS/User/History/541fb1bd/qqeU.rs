use std::{io::Write, net::TcpStream};

struct ping {}
pub fn ping(stream: &mut TcpStream) {
    let _ = stream.write(b"+PONG\r\n");
}
