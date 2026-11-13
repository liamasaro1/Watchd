import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ScrollView, Keyboard, Modal} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOGRlMjAxOGQ1NzUxMDk0NGI1NDgyNmIyMzU3ZmY5NCIsIm5iZiI6MTc5MzgxMDk4Mi42MDMwMDAyLCJzdWIiOiI2YWViNjIyNjczY2M1NDUwYTIxYTlkNjAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.60dIM9myTC8_urMGZIC8S8eW1s1Jc5IBO-tNhsBfEdY';

const HomeScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  let posts = [
  {
    id:'a',
    username: 'beccahimmel',
    program: 'A Star is Born',
    review: 'This movie was amazing! I loved the music and the acting was top-notch. Highly recommend!',
    rating: 5,
    poster: 'https://chscommunicator.com/wp-content/uploads/2018/11/a-star-is-born-movie-poster-1000x563-900x506.jpg',
    profileImage: 'https://img.magnific.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80'
  },

  {
    id: 'b',
    username: 'elianabrunback',
    program: 'Criminal Minds',
    review: 'I have been a fan of this show for years. The characters are well-developed and the storylines are always intriguing.',
    rating: 4,
    poster: 'https://m.media-amazon.com/images/I/71hjktnU-iL.jpg',
    profileImage: 'https://img.magnific.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80'

  },

  {
    id: 'c',
    username: 'valvaldez',
    program: 'Moana',
    review: 'This movie is a beautiful story about courage and self-discovery. The animation is stunning and the music is unforgettable.',
    rating: 5,
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPfLCbbr4jBGzf3sDmkfIicFkUqEc2FO2YMq_0i1v5TnA_1jBq4RBgcWCe&s=10',
    profileImage: 'https://img.magnific.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80'
  }

  ];
  

  function getMovies () {
       return fetch('https://api.themoviedb.org/3/movie/popular',{
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: 'application/json'
        },
       })
       .then(response => {
        if (!response.ok) {
          throw new Error(`TMDB error: ${response.status}`);
        }
        return response.json();
      })
      .then(responseJson => {
        setMovies((responseJson.results || []).filter(item => item.poster_path));
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Fetches movies and TV shows matching the search text.
  function searchMovies(query, signal) {
    return fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false`,
      {
        method: 'GET',
        signal,
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: 'application/json'
        }
      }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error(`TMDB error: ${response.status}`);
      }
      return response.json();
    })
    .then(responseJson => {
      setSearchResults((responseJson.results || []).filter(item =>
        (item.media_type === 'movie' || item.media_type === 'tv') &&
        item.poster_path
      ));
    });
  }


  // useEffect tells React to call the getMovies function after rendering the component for the first time. 
  // The empty array as the second argument means this effect will only run once
  useEffect(() => {
    getMovies();
  }, []);

  // Automatically search when the text changes.
  useEffect(() => {
    if (!searchVisible || !search.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    setSearchLoading(true);

    // Wait 350ms before searching so we don't fetch
    // on every single keystroke.
    const timer = setTimeout(() => {
      searchMovies(search.trim(), controller.signal)
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error(error);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setSearchLoading(false);
          }
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, searchVisible]);

  // Close search and return to the normal HomeScreen.
  function closeSearch() {
    Keyboard.dismiss();
    setSearchVisible(false);
    setSearch('');
    setSearchResults([]);
  }



  const renderItem = data => {
    const item = data.item;
    return (
      <TouchableOpacity 
        style={{marginRight: 10, alignItems: 'center', paddingTop: 5}}
        onPress={() => {
          navigation.navigate('Add', {movie: item})
          alert(
            `${item.title}\nID: ${item.id}\nPopularity: ${item.popularity}\nReleased on: ${item.release_date}`
          );
        }}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={{ width: 100, height: 150, borderRadius: 5 }}
        />
      </TouchableOpacity>
    )
  };

  // Used for search results inside the Modal.
  const renderSearchItem = ({ item }) => {
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? date.slice(0, 4) : 'Year unknown';
    const type = item.media_type === 'movie' ? 'Movie' : 'TV Show';

    return (
      <TouchableOpacity
        style={styles.searchResult}
        onPress={() => {
          navigation.navigate('Add', {movie: item})
          closeSearch()
          alert(`${title}\n${type}\n${year}\nID: ${item.id}`);
        }}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={styles.searchPoster}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.searchTitle}>{title}</Text>
          <Text style={styles.searchDetails}>{type} · {year}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Implement Later for posts
  // <FlatList>
  //   <ListHeaderComponent>
  //     <View style = {styles.headerContainer}>
  //       <Text style = {styles.header}>Watchd</Text>
  //     </View>
  //     <View style = {styles.searchContainer}>
  //       <TextInput
  //         style = {styles.textInput}
  //         placeholder = "Search for a movie"/>
  //     </View>
  //     <View style = {styles.forYouContainer}>
  //       <Text style = {styles.subHeader}>For You</Text>
  //       <Text style = {styles.subSubHeader}>Discover recommendations</Text>
  //       <FlatList
  //         data = {movies}
  //         horizontal = {true}
  //         showsHorizontalScrollIndicator={false}
  //         renderItem ={renderItem}
  //         keyExtractor = {item => item.id}
  //       />
  //     </View>
  //     <View style = {styles.forYouContainer}>
  //       <Text style = {styles.subHeader}>Friends' Activity</Text>
  //       <Text style = {styles.subSubHeader}>See what your friends are watching</Text>
  //     </View>
  //   </ListHeaderComponent>
  // </FlatList>

  return (
    <>
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style = {styles.headerContainer}>
        <Text style = {styles.header}>Watchd</Text>
      </View>

      <TouchableOpacity
        style = {styles.searchContainer}
        activeOpacity = {.8}
        onPress={ () => setSearchVisible(true) }>
          <Text style = {styles.searchPlaceholder}>
            Search for a movie or TV show
          </Text>
        </TouchableOpacity>
  
      <View style = {styles.forYouContainer}>
        <Text style = {styles.subHeader}>For You</Text>
        <Text style = {styles.subSubHeader}>Discover recommendations</Text>

        <FlatList
          data = {movies}
          horizontal = {true}
          showsHorizontalScrollIndicator={false}
          renderItem ={renderItem}
          keyExtractor = {item => item.id.toString()}
          snapToInterval={110}
          decelerationRate="fast"
        />
      </View>

      <View style = {styles.forYouContainer}>
        <Text style = {styles.subHeader}>Friends' Activity</Text>
        <Text style = {styles.subSubHeader}>See what your friends are watching</Text>
      </View>
      {posts.map(post => (
        <View 
          key={post.id} 
          style={{
            marginTop: 20, 
            backgroundColor: '#ffffff', 
            borderRadius: 10, 
            padding: 10, 
            width: '85%'
            }}>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image 
              source={{ uri: post.profileImage }}
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
            />
            <Text style={{fontWeight: 'bold'}}>{post.username}</Text>
          </View>
          <Image 
              source={{ uri: post.poster }}
              style={{ width: '90%', height: 200, borderRadius: 5, marginRight: 10 , alignSelf: 'center'}}
            />
          <Text style={{marginTop: 10}}>{post.review}</Text>
          <Text style={{marginTop: 5, fontStyle: 'italic'}}>Rating: {post.rating}/5
          </Text>
        </View>
      ))}
    </ScrollView>
    {/* Search overlay sits outside the ScrollView */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={searchVisible}
        onRequestClose={closeSearch}
      >
        <View style={styles.modalContent}>
          {/* Tapping the dark background closes the search */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeSearch}
          />

          <View style={styles.modalSearchArea}>
            <View style={styles.modalSearchRow}>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Search movies and TV shows"
                placeholderTextColor="#888888"
                value={search}
                onChangeText={setSearch}
                autoFocus={true}
                autoCorrect={false}
                returnKeyType="search"
              />

              <TouchableOpacity onPress={closeSearch}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {search.trim().length > 0 && (
              <View style={styles.resultsContainer}>
                {searchLoading ? (
                  <Text style={styles.resultMessage}>Searching...</Text>
                ) : (
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchItem}
                    keyExtractor={item => `${item.media_type}-${item.id}`}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                      <Text style={styles.resultMessage}>
                        No results found
                      </Text>
                    }
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
      </View>
    </View>
  );
}

const AddScreen = ({route}) => {
  const movie = route.params?.movie;

  return (
    <ScrollView style={styles.container}>
      {movie ? (
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.addPoster}
            resizeMode="contain"
          />
          <Text>{movie.title || movie.name}</Text>
          <Text>{movie.release_date || movie.first_air_date}</Text>
        </View>
      ) : (
        <Text>No movie selected</Text>
      )}
    </ScrollView>
  );
};


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings-sharp' : 'settings-outline';
            } else if (route.name === 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6eaaff',
          tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6eaaff',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  movieTitle: {
    fontSize: 12,
    paddingTop: 5,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subSubHeader: {
    fontSize: 15,
    color: '#efefef',
  },
  headerContainer: {
    backgroundColor: '#6eaaff',
    alignItems: 'center',
    paddingTop: 75,
  },
  searchContainer: {
    backgroundColor: '#6eaaff',
    borderColor: '#000000',
    width: '85%',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 15,
    padding: 12,
  },
  searchPlaceholder: {
    fontSize: 18,
    color: '#333333',
  },
  forYouContainer: {
    backgroundColor: '#6eaaff',
    width: '85%',
    marginTop: 30,
  },
  textInput: {
    fontSize: 18,
    padding: 2,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },

  // MODAL STYLES
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalSearchArea: {
    marginTop: 65,
    marginHorizontal: 15,
    flex: 1,
  },
  modalSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTextInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 17,
    color: '#000000',
  },
  cancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    gap: 12,
  },
  searchPoster: {
    width: 55,
    height: 80,
    borderRadius: 5,
  },
  addPoster: {
    width: 240,
    height: 360,
    borderRadius: 5,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  searchDetails: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },
  resultMessage: {
    padding: 20,
    color: '#666666',
    textAlign: 'center',
  },
});