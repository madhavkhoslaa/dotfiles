use std::{net::TcpStream, process::Command};

use super::Icommand;

struct echo;
impl Icommand::ICommand for echo {
    fn parser(resp_string: String) -> Command {
                let command_array: Vec<_> = resp_string.split("\r\n").collect();
                let n_arguments = command_array[0].replace("*", "").parse::<u8>().unwrap();

        Command {
                args: n_arguments,
                operation: Self::match_op_string(
                    &command_array
                        .get(2)
                        .unwrap()
                        .to_string()
                        .to_ascii_uppercase(),
                )
                .unwrap(),
                arg1: Some(command_array.get(4).unwrap().to_string()),
                arg2: Some(command_array.get(6).unwrap().to_string()),
            }
    }
    fn handle(resp_string: String, stream: &mut TcpStream) {}
}
