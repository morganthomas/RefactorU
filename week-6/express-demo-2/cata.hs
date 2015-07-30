type Algebra f a = f a -> a
newtype Mu f = InF { outF :: f (Mu f) }
cata :: Functor f => Algebra f a -> Mu f -> a
cata f = f . fmap (cata f) . outF
