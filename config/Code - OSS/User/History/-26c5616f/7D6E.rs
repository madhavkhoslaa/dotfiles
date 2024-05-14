pub struct response {
    pub response: String,
}

impl response {
    pub fn to_resp(&self) -> String {
        let length = self.response.len();
        format!("${}\r\n{}\r\n", length, self.response)
    }
}
