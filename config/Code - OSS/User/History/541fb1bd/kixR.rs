use std::{io::Write, net::TcpStream};

use super::Icommand;

struct ping {}

impl Icommand::ICommand for ping{}
pub fn ping(stream: &mut TcpStream) {
    let _ = stream.write(b"+PONG\r\n");
}
