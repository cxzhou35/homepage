import {
  CalendarIcon,
  ChatIcon,
  HamburgerIcon,
  SearchIcon
} from '@chakra-ui/icons'
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { forwardRef, useEffect, useRef } from 'react'
import { IoLogoGithub } from 'react-icons/io5'

import Logo from './logo'
import ThemeToggleButton from './utils/theme-toggle-button'

const LinkItem = ({ href, path, target, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  return (
    <Link
      as={NextLink}
      href={href}
      scroll={false}
      p={2}
      bg={active ? 'grassTeal' : undefined}
      color={active ? '#202023' : inactiveColor}
      target={target}
      {...props}
    >
      {children}
    </Link>
  )
}

const MenuLink = forwardRef((props, ref) => (
  <Link ref={ref} as={NextLink} {...props} />
))

const Navbar = props => {
  const { path } = props
  const searchInput = useRef(null)

  useEffect(() => {
    const focusSearch = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
        searchInput.current?.select()
      }
    }

    document.addEventListener('keydown', focusSearch)
    return () => document.removeEventListener('keydown', focusSearch)
  }, [])

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={2}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>

        {/* navbar item list */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href="/papers" path={path}>
            <CalendarIcon mb={1} mx="2px" /> Publications
          </LinkItem>
          <LinkItem href="/posts" path={path}>
            <ChatIcon mb={1} mx="2px" /> Posts
          </LinkItem>
          <LinkItem
            target="_blank"
            href="https://github.com/cxzhou35/homepage"
            path={path}
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            <IoLogoGithub mb={1} mx="2px" /> Source
          </LinkItem>
        </Stack>

        <Flex flex={1} align="center" justify="flex-end" gap={2}>
          <InputGroup
            as="form"
            action="/search"
            method="get"
            size="sm"
            w={{ base: '120px', md: '160px' }}
            mr={2}
          >
            <InputLeftElement pointerEvents="none">
              <SearchIcon boxSize="14px" color="gray.600" />
            </InputLeftElement>
            <Input
              ref={searchInput}
              name="q"
              type="search"
              aria-label="Search site"
              aria-keyshortcuts="Control+K Meta+K"
              placeholder="Search"
              pl={8}
              pr={{ base: 2, md: '48px' }}
              borderWidth="2px"
              borderColor={useColorModeValue('iconLight', 'iconDark')}
              borderRadius="lg"
              focusBorderColor="teal.500"
              required
            />
            <InputRightElement
              pointerEvents="none"
              w="42px"
              display={{ base: 'none', md: 'flex' }}
            >
              <Text
                as="span"
                fontSize="xs"
                color={useColorModeValue('gray.700', 'gray.300')}
              >
                ⌘ K
              </Text>
            </InputRightElement>
          </InputGroup>
          <ThemeToggleButton />

          <Box display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <MenuItem as={MenuLink} href="/">
                  About
                </MenuItem>
                <MenuItem as={MenuLink} href="/papers">
                  Publications
                </MenuItem>
                <MenuItem as={MenuLink} href="/posts">
                  Posts
                </MenuItem>
                <MenuItem as={Link} href="https://github.com/cxzhou35/homepage">
                  View Source
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
