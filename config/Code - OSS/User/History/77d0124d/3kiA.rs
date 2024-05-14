use std::net::TcpStream;

use crate::{command::command::Command, inMemory::db::db};

pub trait ICommand {
    fn parser(resp_string: String) -> Command;
    fn handle(command_meta: Command, stream: &mut TcpStream, ctx: Rc<db>);
}
