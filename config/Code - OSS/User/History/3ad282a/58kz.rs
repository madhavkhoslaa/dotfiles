use crate::command::command::Command;
use std::net::TcpStream;

struct echo;
impl Command::Icommand for echo {}
