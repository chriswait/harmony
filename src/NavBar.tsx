import { useRef } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, HamburgerIcon, MinusIcon, SearchIcon } from '@chakra-ui/icons';

import { useDatabase } from './DatabaseProvider';
import { useTheme } from './ThemeProvider';
import { useSong } from './SongProvider';
import SongList from './SongList';

const NavBar = () => {
  const { exportSongAsJson, saveSongToDatabase } = useSong();
  const { selectedSongId, deleteSong } = useDatabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { zoom, setZoom } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <Box>
      <Container maxW={'container.xl'} mb={2} p={2}>
        <Flex align={'center'} gap={2}>
          <IconButton
            aria-label="menu"
            ref={btnRef}
            onClick={onOpen}
            icon={<HamburgerIcon />}
          >
            Open
          </IconButton>
          <Spacer />
          <ButtonGroup isAttached variant="outline" alignItems={'center'} mr={[2, 4, 6]}>
            <SearchIcon boxSize={5} mr={2} />
            <IconButton
              disabled={zoom === 0}
              size="sm"
              aria-label="decrease"
              icon={<MinusIcon />}
              onClick={() => setZoom(Math.min(zoom + 1, 3))}
            />
            <IconButton
              disabled={zoom === 3}
              size="sm"
              aria-label="increase"
              icon={<AddIcon />}
              onClick={() => setZoom(Math.max(zoom - 1, 0))}
            />
          </ButtonGroup>
          <Button onClick={saveSongToDatabase}>Save</Button>
        </Flex>
      </Container>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Songs</DrawerHeader>
          <DrawerBody>
            <SongList />
          </DrawerBody>
          <DrawerFooter>
            {/* <input
              accept="application/json"
              type="file"
              onChange={async (event) => {
                if (event.target.files) {
                  const [file] = event.target.files
                  const textContent = await file.text();
                  const songObject = parseImport(textContent);
                  if (songObject) {
                    importSongFromJson(songObject);
                  }
                }
              }}
            /> */}
            <Button onClick={exportSongAsJson}>Export</Button>
            <Button
              colorScheme="red"
              disabled={selectedSongId === undefined}
              onClick={() => deleteSong(selectedSongId!)}
            >
              Delete Song
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
export default NavBar;
