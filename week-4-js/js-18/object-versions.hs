data Operation a d = Operation {
  description :: d,
  perform :: a -> a,
  rollback :: a -> a
}

data VersioningConfig = VersioningConfig {
  
}

data VersionedObject a d = VersionedObject {
  value :: a,
  history :: [Operation a d]
}
