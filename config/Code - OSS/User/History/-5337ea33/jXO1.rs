use std::{io::Write, net::TcpStream};

use super::Icommand;
use crate::{
    command::{command::Command, values::OpCodes},
    inMemory::db::db,
    response::response::response,
};

pub struct set {}

impl Icommand::ICommand for set {
    fn parser(resp_string: String) -> Command {
        let command_array: Vec<_> = resp_string.split("\r\n").collect();
        let n_arguments = command_array[0].replace("*", "").parse::<u8>().unwrap();
        Command {
            args: n_arguments,
            operation: OpCodes::GET,
            arg1: Some(command_array.get(4).unwrap().to_string()),
            arg2: Some(command_array.get(6).unwrap().to_string()),
        }
    }
    fn handle(command_meta: Command, stream: &mut TcpStream, ctx: &mut db) {
        ctx.to_owned().set(command_meta.arg1.unwrap(), command_meta.arg2.unwrap());
        let _ = stream.write(b" +OK\r\n");
    }
}
