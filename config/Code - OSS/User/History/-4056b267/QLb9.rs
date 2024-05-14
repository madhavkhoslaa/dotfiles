use std::{net::TcpStream, rc::Rc};

use crate::{
    commands_handlers::{
        echo,
        get::get,
        ping,
        set::set,
        Icommand::{self, ICommand},
    },
    inMemory::db::db,
};

use super::values::OpCodes;

#[derive(Debug, Clone)]
pub struct Command {
    pub args: u8,
    pub operation: OpCodes,
    pub arg1: Option<String>,
    pub arg2: Option<String>,
}

impl Command {
    pub fn Parse(resp_string: String) -> Result<Command, ()> {
        let command_array: Vec<_> = resp_string.split("\r\n").collect();
        let n_arguments = command_array[0].replace("*", "").parse::<u8>().unwrap();
        if command_array.len() as u8 != n_arguments * 2 + 2 {
            return Err(());
        } else {
            let op: Option<OpCodes> = Self::match_op_string(
                &command_array
                    .get(2)
                    .unwrap()
                    .to_string()
                    .to_ascii_uppercase(),
            );
            Ok(Self::get_command(op.unwrap(), resp_string))
        }
    }
    pub fn match_op_string(op_string: &String) -> Option<OpCodes> {
        match op_string.as_str() {
            "GET" => Some(OpCodes::GET),
            "ECHO" => Some(OpCodes::ECHO),
            "SET" => Some(OpCodes::SET),
            "PING" => Some(OpCodes::PING),
            _ => None,
        }
    }

    pub fn get_command(opCode: OpCodes, resp_string: String) -> Command {
        match opCode {
            OpCodes::ECHO => echo::echo::parser(resp_string),
            OpCodes::GET => get::parser(resp_string),
            OpCodes::SET => set::parser(resp_string),
            OpCodes::PING => ping::ping::parser(resp_string),
        }
    }
    pub fn handle(&self, stream: &mut TcpStream, ctx: Rc<db>) {
        match self.operation {
            OpCodes::ECHO => echo::echo::handle(self.clone(), stream, ctx),
            OpCodes::GET => get::handle(self.clone(), stream, ctx),
            OpCodes::SET => set::handle(self.clone(), stream, ctx),
            OpCodes::PING => ping::ping::handle(self.clone(), stream, ctx),
        }
    }
}
