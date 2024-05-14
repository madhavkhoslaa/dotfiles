use std::collections::HashMap;

use crate::inMemory;
#[derive(Debug, Clone)]
pub struct context<'a> {
    pub db: &'a inMemory::db::db,
}

impl context {
    pub fn new() -> Self {
        context {
            db: &inMemory::db::db {
                map: &HashMap::new(),
            },
        }
    }
}
