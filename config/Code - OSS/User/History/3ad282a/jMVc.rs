use std::{net::TcpStream};

use crate::command::{command::Command, values::OpCodes};

use super::Icommand;

struct echo;
impl Icommand::ICommand for echo {
    fn parser(resp_string: String) -> Command {
        let command_array: Vec<_> = resp_string.split("\r\n").collect();
        let n_arguments = command_array[0].replace("*", "").parse::<u8>().unwrap();
        Command {
            args: n_arguments,
            operation: OpCodes::ECHO,
            arg1: Some(command_array.get(4).unwrap().to_string()),
            arg2: None,
        }
    }
    fn handle(resp_string: String, stream: &mut TcpStream) {}
}
