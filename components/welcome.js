import {
  Box,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaLanguage } from 'react-icons/fa'

const nextLanguage = { en: 'zh', zh: 'kr', kr: 'en' }

const Welcome = () => {
  const [language, setLanguage] = useState('en') // default: en
  const [displayedText, setDisplayedText] = useState('')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const messages = {
    en: {
      text: "Hello, I'm Zicx, welcome to my homepage!",
      fontFamily: 'M PLUS Rounded 1c',
      buttonText: 'en'
    },
    zh: {
      text: '你好, 我是周晨旭, 欢迎来到我的主页!',
      fontFamily: 'LXGW WenKai TC',
      buttonText: 'zh'
    },
    kr: {
      text: '안녕하세요, 저는 조신욱입니다. 제 홈페이지에 오신 것을 환영합니다!',
      fontFamily: 'Noto Serif KR',
      buttonText: 'kr'
    }
  }
  const targetText = messages[language].text

  const toggleLanguage = () => {
    setIsAutoPlaying(false)
    setLanguage(prevLanguage => nextLanguage[prevLanguage])
  }

  useEffect(() => {
    if (!isAutoPlaying || displayedText !== targetText) return

    const timer = setTimeout(
      () => setLanguage(prevLanguage => nextLanguage[prevLanguage]),
      2500
    )

    return () => clearTimeout(timer)
  }, [displayedText, isAutoPlaying, targetText])

  useEffect(() => {
    if (displayedText === targetText) return

    const erasing = !targetText.startsWith(displayedText)
    const timer = setTimeout(
      () =>
        setDisplayedText(
          erasing
            ? displayedText.slice(0, -1)
            : targetText.slice(0, displayedText.length + 1)
        ),
      erasing ? 22 : 55
    )

    return () => clearTimeout(timer)
  }, [displayedText, targetText])

  return (
    <Box
      borderRadius="lg"
      p={3}
      mt={4}
      mb={4}
      maxW="calc(var(--chakra-sizes-prose) - 2rem)"
      mx="auto"
      textAlign="center"
      bg={useColorModeValue(
        'linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.2))',
        'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))'
      )}
      border="1px solid"
      borderColor={useColorModeValue('whiteAlpha.700', 'whiteAlpha.300')}
      boxShadow={useColorModeValue(
        '0 8px 32px rgba(31,38,50,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
        '0 8px 32px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.15)'
      )}
      css={{
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        animation: 'float 3s ease-in-out infinite'
      }}
      position="relative"
      _hover={{
        transform: 'scale(1.05)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      <Text
        fontSize="md"
        fontFamily={messages[language].fontFamily}
        minH="1.5em"
        aria-label={targetText}
        _after={{
          content: '"|"',
          ml: '2px',
          animation:
            displayedText === targetText
              ? 'caret-blink 1s step-end infinite'
              : 'none'
        }}
        css={{ '@keyframes caret-blink': { '50%': { opacity: 0 } } }}
      >
        {displayedText}
      </Text>
      <Tooltip
        label="Toggle Language"
        fontSize="12"
        placement="right"
        hasArrow
        bg={useColorModeValue('iconLight', 'iconDark')}
        color={useColorModeValue('gray.800', 'whiteAlpha.900')}
        borderRadius="lg"
      >
        <IconButton
          aria-label="Toggle Language"
          icon={<FaLanguage />}
          onClick={toggleLanguage}
          position="absolute"
          top="-8px"
          right="10px"
          size="sm"
          variant="ghost"
          _hover={{
            color: useColorModeValue('pink.500', 'teal.300'),
            transform: 'rotate(20deg)',
            transition: 'transform 0.2s ease-in-out'
          }}
        />
      </Tooltip>
    </Box>
  )
}

export default Welcome
