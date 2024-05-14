use super::command::Command;

trait ICommand {
    fn parser(resp_string: String) -> Command;
    fn handle(resp_string: String) -> Command;
}
