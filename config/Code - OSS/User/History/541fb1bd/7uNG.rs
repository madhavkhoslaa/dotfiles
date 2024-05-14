use std::{io::Write, net::TcpStream};

use super::Icommand;

pub struct ping {}

impl Icommand::ICommand for ping {
    fn parser(resp_string: String) -> crate::command::command::Command {
    fn parser(resp_string: String) -> Command {
        let command_array: Vec<_> = resp_string.split("\\r\\n").collect();
        let n_arguments = command_array[0].replace("*", "").parse::<u8>().unwrap();
        Command {
            args: n_arguments,
            operation: OpCodes::ECHO,
            arg1: Some(command_array.get(4).unwrap().to_string()),
            arg2: None,
        }
    }

    fn handle(command_meta: crate::command::command::Command, stream: &mut TcpStream) {
        let _ = stream.write(b"+PONG\r\n");
    }
}
