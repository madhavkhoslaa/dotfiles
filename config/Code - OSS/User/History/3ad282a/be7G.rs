use std::{net::TcpStream, process::Command};

use super::Icommand;

struct echo;
impl Icommand::ICommand for echo {
    pub fn parser(resp_string: String) -> Command {}
}
