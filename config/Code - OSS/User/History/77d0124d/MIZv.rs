use super::command::Command;

trait ICommand {
    pub fn parser(resp_string: String) -> Command;
}