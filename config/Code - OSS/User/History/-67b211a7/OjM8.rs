use std::{io::Write, net::TcpStream};

use crate::command::{command::Command, values::OpCodes};

use super::Icommand;

pub struct get {}

impl Icommand::ICommand for get {
    fn parser(resp_string: String) -> Command {
        let command_array: Vec<_> = resp_string.split("\r\n").collect();
        let n_arguments = command_array[0].replace("*", "").parse::<u8>().unwrap();
        Command {
            args: n_arguments,
            operation: OpCodes::PING,
            arg1: None,
            arg2: None,
        }
    }
    fn handle(command_meta: crate::command::command::Command, stream: &mut TcpStream) {
        let _ = stream.write(b"+PONG\r\n");
    }
}
