use std::net::TcpStream;

use crate::{command::command::Command, Context::context};

pub trait ICommand {
    fn parser(resp_string: String) -> Command;
    fn handle(command_meta: Command, stream: &mut TcpStream, ctx: &context);
}
