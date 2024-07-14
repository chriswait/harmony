import {
  AddIcon,
  DeleteIcon,
  HamburgerIcon,
  MinusIcon,
  SearchIcon,
} from '@chakra-ui/icons';
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
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useDatabase } from './DatabaseProvider';
import { useSong } from './SongProvider';
import { useTheme } from './ThemeProvider';
import WarmupModalContent from './Warmup';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const { songId } = useParams();
  const { exportSongAsJson, saveSongToDatabase, createNewSong } = useSong();
  const { songs, deleteSong } = useDatabase();
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpen,
    onClose: drawerOnClose,
  } = useDisclosure();
  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();
  const {
    isOpen: warmupModalIsOpen,
    onOpen: warmupModalOnOpen,
    onClose: warmupModalOnClose,
  } = useDisclosure();
  const { zoom, setZoom, isEditing, setIsEditing } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [newSongName, setNewSongName] = useState('');
  const initialRef = useRef(null);
  return (
    <>
      <Box position={'fixed'} w={'full'} top={0} bg={'black'} zIndex={1}>
        <Container maxW={'container.xl'} mb={2} p={2}>
          <Flex align={'center'} gap={2}>
            <IconButton
              aria-label="menu"
              ref={btnRef}
              onClick={drawerOnOpen}
              icon={<HamburgerIcon />}
            >
              Open
            </IconButton>
            <Box>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="edit" mb="0">
                  Edit
                </FormLabel>
                <Switch
                  id="edit"
                  isChecked={isEditing}
                  onChange={(event) => setIsEditing(event.target.checked)}
                />
              </FormControl>
            </Box>
            <Spacer />
            <ButtonGroup
              isAttached
              variant="outline"
              alignItems={'center'}
              mr={[2, 4, 6]}
            >
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
            <Button
              onClick={() =>
                saveSongToDatabase(songId ? parseInt(songId, 10) : undefined)
              }
            >
              Save
            </Button>
          </Flex>
        </Container>
        <Drawer
          isOpen={drawerIsOpen}
          placement="left"
          onClose={drawerOnClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>🎶 Harmony Club 🎶</DrawerHeader>
            <DrawerBody>
              <Flex rowGap={4} flexDir="column" mb={4}>
                <Button
                  width="100%"
                  rightIcon={<AddIcon />}
                  colorScheme="red"
                  onClick={() => {
                    modalOnOpen();
                  }}
                >
                  New Song!
                </Button>
                <Button
                  width="100%"
                  colorScheme="green"
                  onClick={() => warmupModalOnOpen()}
                >
                  Warmup
                </Button>
              </Flex>
              <Heading size="md" mb={2}>
                Songs:
              </Heading>
              <List spacing={2}>
                {songs.map((song) => (
                  <ListItem
                    key={`song-${song.id}`}
                    display="flex"
                    justifyContent={'space-between'}
                  >
                    <Button
                      onClick={() => {
                        navigate(`/${song.id}`);
                        drawerOnClose();
                      }}
                      style={{
                        fontWeight:
                          song.id === parseInt(songId ?? '', 10) ? 'bold' : undefined,
                      }}
                    >
                      {song.song_data.songName}
                    </Button>
                    <IconButton
                      aria-label="Delete"
                      onClick={async () => {
                        await deleteSong(song.id);
                        drawerOnClose();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </DrawerBody>
            <DrawerFooter gap={2}>
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
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
      <Modal isOpen={modalIsOpen} onClose={modalOnClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Song!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={initialRef}
                value={newSongName}
                onChange={(event) => setNewSongName(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                await createNewSong(newSongName);
                modalOnClose();
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={warmupModalIsOpen}
        onClose={warmupModalOnClose}
        initialFocusRef={initialRef}
        size="full"
      >
        <WarmupModalContent />
      </Modal>
    </>
  );
};
export default NavBar;
