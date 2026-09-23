import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Layout from '../components/layouts/article'
import { PaperItem } from '../components/utils/paper-item'
import Section from '../components/utils/section'
import { papers } from '../data/paperinfo'

const Papers = () => {
  const navigationButtonBg = useColorModeValue('iconLight', 'iconDark')
  const navigationButtonBorder = useColorModeValue(
    'blackAlpha.200',
    'whiteAlpha.300'
  )

  return (
    <Layout title="Publications">
      <Container maxW="container.md">
        <Flex align="center" justify="space-between" gap={4} mb={2} pt={6}>
          <Heading as="h1" fontSize={20}>
            Publications
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
        <Text fontSize="sm" color="gray.500" mb={4}>
          <Text as="span" fontWeight="bold">
            *
          </Text>{' '}
          Equal Contribution,{' '}
          <Text as="span" fontWeight="bold">
            ‡
          </Text>{' '}
          Corresponding Author
        </Text>

        {papers.map((paper, index) => (
          <Section key={paper.title} delay={(index + 1) * 0.1}>
            <PaperItem {...paper} />
          </Section>
        ))}
      </Container>
    </Layout>
  )
}

export default Papers
export { getServerSideProps } from '../components/utils/chakra'
