import {
  Box,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  useClipboard,
  useColorModeValue
} from '@chakra-ui/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { FaFilePdf, FaGithub } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { TbCheck, TbCopy, TbFileText } from 'react-icons/tb'
import { Meta } from './post'

const CONFERENCE_COLORS = {
  CVPR: 'blue',
  ICCV: 'teal',
  ECCV: 'pink',
  NIPS: 'purple',
  ICLR: 'green',
  SIGGRAPH: 'red',
  'SIGGRAPH ASIA': 'orange',
  AAAI: 'cyan'
}

const isVideo = file =>
  typeof file === 'string' && /\.(mp4|webm|ogg)$/i.test(file)

const VideoPreview = ({ src, poster }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    let isVisible = false

    const updatePlayback = () => {
      const shouldPlay = isVisible && !document.hidden

      if (shouldPlay) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting
              updatePlayback()
            },
            { threshold: 0.35 }
          )
        : null

    if (observer) {
      observer.observe(video)
    } else {
      isVisible = true
      updatePlayback()
    }

    document.addEventListener('visibilitychange', updatePlayback)

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', updatePlayback)
      video.pause()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      style={{
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: '100%'
      }}
    />
  )
}

const Authors = ({ authors }) => (
  <>
    {authors.map(
      (
        {
          name,
          isMe = false,
          equalContribution = false,
          correspondingAuthor = false
        },
        index
      ) => (
        <span key={`${name}-${index}`}>
          <Text as="span" fontWeight={isMe ? 'bold' : 'normal'}>
            {name}
            {equalContribution && (
              <Text as="sup" fontWeight="bold" title="Equal contribution">
                *
              </Text>
            )}
            {correspondingAuthor && (
              <Text as="sup" fontWeight="bold" title="Corresponding author">
                ‡
              </Text>
            )}
          </Text>
          {index < authors.length - 1 ? ', ' : ''}
        </span>
      )
    )}
  </>
)

const ResourceLink = ({ href, icon: Icon, children }) => {
  const content = (
    <>
      <Icon aria-hidden="true" />
      <Text as="span">{children}</Text>
    </>
  )

  if (!href) {
    return (
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        gap={1}
        color="gray.500"
        cursor="not-allowed"
        aria-disabled="true"
        title="Coming soon"
      >
        {content}
      </Box>
    )
  }

  return (
    <Link
      href={href}
      isExternal
      display="inline-flex"
      alignItems="center"
      gap={1}
      _hover={{ color: 'teal.500' }}
    >
      {content}
    </Link>
  )
}

export const PaperItem = ({
  title,
  authors,
  conference,
  year,
  thumbnail,
  poster,
  projectPage,
  paperLink,
  codeLink,
  bibtex,
  tag = ''
}) => {
  const { hasCopied, onCopy } = useClipboard(bibtex || '')
  const linkColor = useColorModeValue('linkLight', 'linkDark')
  const previewBackground = useColorModeValue(
    'whiteAlpha.500',
    'whiteAlpha.200'
  )
  const citationBackground = useColorModeValue('gray.100', 'gray.800')
  const conferenceColor =
    CONFERENCE_COLORS[conference?.toUpperCase()] || 'purple'
  const titleLink = paperLink || projectPage

  return (
    <Box as="article" w="100%">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'flex-start' }}
        spacing={{ base: 3, md: 6 }}
      >
        <Box
          flexShrink={0}
          width={{ base: '100%', md: '200px' }}
          minHeight={{ base: 'auto', md: '120px' }}
          aspectRatio={5 / 3}
          position="relative"
          overflow="hidden"
          borderRadius="8px"
          backgroundColor={previewBackground}
        >
          {isVideo(thumbnail) ? (
            <VideoPreview src={thumbnail} poster={poster} />
          ) : (
            <Image
              src={thumbnail}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 47.99em) calc(100vw - 2rem), 200px"
            />
          )}
        </Box>

        <Box flex="1" minWidth={0}>
          <Text as="h2" fontSize="md" fontWeight="bold" mb={1}>
            {titleLink ? (
              <Link
                href={titleLink}
                isExternal
                color="inherit"
                _hover={{ color: linkColor }}
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </Text>

          <Text fontSize="md" mb={1}>
            <Authors authors={authors} />
          </Text>

          <Box fontSize="md" mb={1} fontStyle="italic">
            <Meta color={conferenceColor}>
              {conference} {year}
            </Meta>
            {tag && (
              <Text as="span" color="red.500" fontWeight="bold">
                ({tag})
              </Text>
            )}
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            columnGap={4}
            rowGap={1}
            color={linkColor}
          >
            {projectPage !== undefined && (
              <ResourceLink href={projectPage} icon={IoHome}>
                Page
              </ResourceLink>
            )}
            {paperLink && (
              <ResourceLink href={paperLink} icon={FaFilePdf}>
                Paper
              </ResourceLink>
            )}
            {codeLink !== undefined && (
              <ResourceLink href={codeLink} icon={FaGithub}>
                Code
              </ResourceLink>
            )}
            {bibtex && (
              <Popover placement="right-start">
                <PopoverTrigger>
                  <Link
                    as="button"
                    type="button"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                    _hover={{ color: 'teal.500' }}
                  >
                    <TbFileText aria-hidden="true" size={18} />
                    BibTeX
                  </Link>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent
                    w="400px"
                    maxW="calc(100vw - 2rem)"
                    bg={citationBackground}
                    p={3}
                    position="relative"
                  >
                    <Box
                      as="pre"
                      fontSize="xs"
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      maxH="50vh"
                      overflowY="auto"
                    >
                      {bibtex.split('\n').map((line, index) => {
                        const indent = line.length - line.trimStart().length
                        return (
                          <Box
                            as="span"
                            display="block"
                            pl={`${indent}ch`}
                            key={index}
                          >
                            {line.slice(indent)}
                          </Box>
                        )
                      })}
                    </Box>
                    <IconButton
                      position="absolute"
                      right={2}
                      bottom={2}
                      size="sm"
                      fontSize="lg"
                      variant="ghost"
                      colorScheme="teal"
                      aria-label={hasCopied ? 'Copied BibTeX' : 'Copy BibTeX'}
                      icon={hasCopied ? <TbCheck /> : <TbCopy />}
                      onClick={onCopy}
                    />
                  </PopoverContent>
                </Portal>
              </Popover>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
