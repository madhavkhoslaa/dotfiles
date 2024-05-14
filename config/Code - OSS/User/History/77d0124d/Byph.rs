use std::net::TcpStream;

use crate::command::command::Command;


pub trait ICommand {
    fn parser(resp_string: String) -> Command;
    fn handle(resp_string: String, stream: &mut TcpStream);
}
