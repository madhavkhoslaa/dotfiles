pub struct response {
    response: String
}

impl response {
    pub fn to_resp(&self) -> String {
        let length = self.response.len();
    }
}