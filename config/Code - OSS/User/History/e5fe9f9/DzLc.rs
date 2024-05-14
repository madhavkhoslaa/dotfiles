use std::collections::HashMap;
#[derive(Debug, Clone)]
pub struct db {
    pub map: HashMap<String, String>,
}

impl db {
    pub fn set(mut self, key: String, value: String) {
        self.map.insert(key, value);
    }

    pub fn get(self, key: String) -> Option<String> {
        return self.map.get(&key).cloned();
    }
    pub fn new() -> Self {
        let mut value = HashMap::new();
        &value.insert("a".to_owned(), "hello".to_owned());
        db { map: value }
    }
}
