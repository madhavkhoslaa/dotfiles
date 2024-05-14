use std::collections::HashMap;

pub struct db {
    map: HashMap<String, String>
}

impl db {
    pub fn set(mut self, key: String, value: String) {
        self.map.insert(key, value);
    }

    pub fn get(self, key: String){
        return self.map.get(key).unwrap().to_string()
    }
}