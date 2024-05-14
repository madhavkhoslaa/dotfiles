use std::collections::HashMap;

use crate::inMemory;

pub struct context {
    db: inMemory::db::db
}

impl context {
    pub fn new() -> Self {
        context {
            db:  inMemory::db::db { map: HashMap::new() }
        }
    }
}