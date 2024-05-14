use std::{io::Write, net::TcpStream};

use super::Icommand;

struct ping {}

impl Icommand::ICommand for ping{
    fn parser(resp_string: String) -> crate::command::command::Command {
        todo!()
    }

    fn handle(command_meta: crate::command::command::Command, stream: &mut TcpStream) {
    let _ = stream.write(b"+PONG\r\n");
    }
}
