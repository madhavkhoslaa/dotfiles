use std::collections::HashMap;

use crate::inMemory;
#[derive(Debug, Clone)]
pub struct context {
    pub db: inMemory::db::db,
}

impl context {
    pub fn new() -> Self {
        context {
            db: inMemory::db::db {
                map: HashMap::new(),
            },
        }
    }
}
