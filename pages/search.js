import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Button,
  Container,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/layouts/article'
import { searchSite } from '../lib/search'

const Search = () => {
  const { query } = useRouter()
  const term = typeof query.q === 'string' ? query.q.trim() : ''
  const results = searchSite(term)
  const navigationButtonBg = useColorModeValue('iconLight', 'iconDark')
  const navigationButtonBorder = useColorModeValue(
    'blackAlpha.200',
    'whiteAlpha.300'
  )

  return (
    <Layout title="Search">
      <Container maxW="container.md" pt={6}>
        <Flex align="center" justify="space-between" gap={4} mb={2}>
          <Heading as="h1" fontSize={20}>
            Search
          </Heading>
          <Button
            as={NextLink}
            href="/"
            size="sm"
            bg={navigationButtonBg}
            borderWidth="1px"
            borderColor={navigationButtonBorder}
            leftIcon={<ArrowBackIcon />}
          >
            Back to Home
          </Button>
        </Flex>
        <Text mb={4}>
          {term
            ? `Results for “${term}”`
            : 'Enter a term in the search box above.'}
        </Text>
        {term && results.length === 0 && <Text>No results found.</Text>}
        <List spacing={3}>
          {results.map(result => (
            <ListItem key={result.title}>
              <Link
                as={NextLink}
                href={result.href}
                isExternal={result.href.startsWith('http')}
                fontWeight="semibold"
              >
                {result.title}
              </Link>
              <Text fontSize="sm" color="gray.500">
                {result.detail}
              </Text>
            </ListItem>
          ))}
        </List>
      </Container>
    </Layout>
  )
}

export default Search
export { getServerSideProps } from '../components/utils/chakra'
