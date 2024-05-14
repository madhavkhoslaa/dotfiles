trait ICommand {
    pub fn parser(resp_string: String) -> Command;
}