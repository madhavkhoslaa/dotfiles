use std::net::TcpStream;

use super::Icommand;

struct echo;
impl Icommand::ICommand for echo {}
