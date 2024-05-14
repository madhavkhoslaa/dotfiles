use std::{io::Write, net::TcpStream};

use crate::{
    command::{command::Command, values::OpCodes},
    inMemory::db::db,
};

use super::Icommand;

pub struct ping {}

impl Icommand::ICommand for ping {
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
    fn handle(command_meta: crate::command::command::Command, stream: &mut TcpStream, ctx: &db) {
        let _ = stream.write(b"+PONG\r\n");
    }
}
