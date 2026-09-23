import { Box } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const MODEL_POSTER_URL = '/hollow_knight_fanart.v2.webp'

export const ModelPoster = ({ isReady = false }) => (
  <Box
    as="img"
    src={MODEL_POSTER_URL}
    alt="Hollow Knight 3D model preview"
    position="absolute"
    inset={0}
    width="100%"
    height="100%"
    objectFit="contain"
    opacity={isReady ? 0 : 1}
    transition="opacity 0.3s ease"
    pointerEvents="none"
  />
)

export const ModelContainer = forwardRef(({ children }, ref) => (
  <Box
    ref={ref}
    className="hollow knight"
    m="auto"
    mt={['-20px', '-60px', '-120px']}
    mb={['-40px', '-140px', '-200px']}
    w={[280, 480, 540]}
    h={[280, 480, 540]}
    position="relative"
    overflow="hidden"
  >
    {children}
  </Box>
))

const Loader = () => {
  return (
    <ModelContainer>
      <ModelPoster />
    </ModelContainer>
  )
}

export default Loader
