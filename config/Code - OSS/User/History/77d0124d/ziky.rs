use crate::command::command::Command;


trait ICommand {
    fn parser(resp_string: String) -> Command;
    fn handle(resp_string: String, stream: &mut TcpStream);
}
