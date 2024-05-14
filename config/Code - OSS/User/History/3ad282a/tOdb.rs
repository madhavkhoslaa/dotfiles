use std::{net::TcpStream, process::Command};

use super::Icommand;

struct echo;
impl Icommand::ICommand for echo {
    fn parser(resp_string: String) -> Command {}
    fn handle(resp_string: String, stream: &mut TcpStream) {}
}
