const axios = require('axios');

const API_URL = 'http://localhost:8080/api';
let token = '';

const data = {
  genres: [
    { name: 'Hành động', description: 'Phim hành động kịch tính' },
    { name: 'Kinh dị', description: 'Phim kinh dị giật gân' },
    { name: 'Hài hước', description: 'Phim hài giải trí' },
    { name: 'Viễn tưởng', description: 'Phim khoa học viễn tưởng' },
    { name: 'Tình cảm', description: 'Phim tình cảm lãng mạn' }
  ],
  movies: [
    { title: 'Lật Mặt 7', description: 'Một bộ phim hành động gay cấn của Lý Hải', durationMinutes: 120, director: 'Lý Hải', actors: 'Quách Ngọc Tuyên', language: 'Tiếng Việt', country: 'Việt Nam', ageRating: 'T16', releaseDate: '2026-04-30', status: 'NOW_SHOWING', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500' },
    { title: 'Dune: Part Two', description: 'Hành trình của Paul Atreides', durationMinutes: 166, director: 'Denis Villeneuve', actors: 'Timothée Chalamet, Zendaya', language: 'Tiếng Anh', country: 'Mỹ', ageRating: 'T13', releaseDate: '2026-03-01', status: 'NOW_SHOWING', posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500' },
    { title: 'Kung Fu Panda 4', description: 'Sự trở lại của sát thủ', durationMinutes: 169, director: 'Chad Stahelski', actors: 'Keanu Reeves', language: 'Tiếng Anh', country: 'Mỹ', ageRating: 'T18', releaseDate: '2026-03-24', status: 'NOW_SHOWING', posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500' },
    { title: 'Godzilla x Kong', description: 'Đế chế mới', durationMinutes: 115, director: 'Adam Wingard', actors: 'Rebecca Hall', language: 'Tiếng Anh', country: 'Mỹ', ageRating: 'T13', releaseDate: '2026-03-29', status: 'NOW_SHOWING', posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500' },
    { title: 'Deadpool & Wolverine', description: 'Sự kết hợp bùng nổ', durationMinutes: 120, director: 'Shawn Levy', actors: 'Ryan Reynolds', language: 'Tiếng Anh', country: 'Mỹ', ageRating: 'T16', releaseDate: '2026-07-26', status: 'COMING_SOON', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500' },
    { title: 'Inside Out 2', description: 'Cảm xúc ùa về', durationMinutes: 100, director: 'Kelsey Mann', actors: 'Amy Poehler', language: 'Tiếng Anh', country: 'Mỹ', ageRating: 'P', releaseDate: '2026-06-14', status: 'COMING_SOON', posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500' },
    { title: 'Mai', description: 'Phim tình cảm gia đình của Trấn Thành', durationMinutes: 130, director: 'Trấn Thành', actors: 'Phương Anh Đào', language: 'Tiếng Việt', country: 'Việt Nam', ageRating: 'T16', releaseDate: '2026-02-10', status: 'ENDED', posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500' },
    { title: 'Đào, Phở và Piano', description: 'Phim lịch sử Việt Nam', durationMinutes: 110, director: 'Phi Tiến Sơn', actors: 'Doãn Quốc Đam', language: 'Tiếng Việt', country: 'Việt Nam', ageRating: 'T13', releaseDate: '2026-02-10', status: 'ENDED', posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500' }
  ],
  cinemas: [
    { name: 'CineVe Bà Triệu', address: '191 Bà Triệu', city: 'Hà Nội', phone: '0912345678', email: 'batrieu@cineve.vn', description: 'Rạp tiêu chuẩn', status: 'ACTIVE' },
    { name: 'CineVe Nguyễn Trãi', address: '234 Nguyễn Trãi', city: 'Hà Nội', phone: '0912345679', email: 'nguyentrai@cineve.vn', description: 'Rạp cao cấp', status: 'ACTIVE' },
    { name: 'CineVe Landmark', address: 'Landmark 81', city: 'TP. HCM', phone: '0912345680', email: 'landmark@cineve.vn', description: 'Rạp IMAX', status: 'ACTIVE' }
  ],
  foods: [
    { name: 'Combo Single', description: '1 bắp 1 nước', type: 'COMBO', price: 85000, active: true },
    { name: 'Combo Couple', description: '1 bắp lớn 2 nước', type: 'COMBO', price: 120000, active: true },
    { name: 'Bắp phô mai', description: 'Bắp rang bơ vị phô mai', type: 'POPCORN', price: 55000, active: true },
    { name: 'Coca Cola', description: 'Nước ngọt có ga', type: 'DRINK', price: 35000, active: true }
  ],
  coupons: [
    { code: 'CINEVE20', name: 'Giảm 20%', description: 'Giảm 20% cho vé', type: 'PERCENT', discountValue: 20, minOrderAmount: 100000, maxDiscountAmount: 50000, startTime: '2026-01-01T00:00:00', endTime: '2026-12-31T23:59:59', usageLimit: 1000, active: true },
    { code: 'GIAM50K', name: 'Giảm 50K', description: 'Giảm 50.000đ trực tiếp', type: 'FIXED_AMOUNT', discountValue: 50000, minOrderAmount: 150000, maxDiscountAmount: 50000, startTime: '2026-01-01T00:00:00', endTime: '2026-12-31T23:59:59', usageLimit: 500, active: true }
  ]
};

async function login() {
  console.log('Logging in as admin...');
  const res = await axios.post(`${API_URL}/auth/login`, { email: 'admin@cineve.vn', password: 'admin123' });
  token = res.data.result.token;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

async function seedData() {
  try {
    await login();

    console.log('Creating genres...');
    const genreIds = [];
    for (const g of data.genres) {
      const res = await axios.post(`${API_URL}/admin/genres`, g).catch(e => console.log('Genre exists'));
      if(res && res.data.result.id) genreIds.push(res.data.result.id);
    }
    
    // Fallback if already exists
    const allGenres = await axios.get(`${API_URL}/admin/genres`);
    const validGenreIds = allGenres.data.result.slice(0, 2).map(g => g.id);

    console.log('Creating movies...');
    const movieIds = [];
    for (const m of data.movies) {
      m.genreIds = validGenreIds;
      const res = await axios.post(`${API_URL}/admin/movies`, m).catch(e => console.log('Movie might exist'));
      if(res) movieIds.push(res.data.result.id);
    }

    console.log('Creating cinemas and rooms...');
    const roomIds = [];
    for (const c of data.cinemas) {
      const res = await axios.post(`${API_URL}/admin/cinemas`, c).catch(e => console.log('Cinema might exist'));
      const cinemaId = res ? res.data.result.id : (await axios.get(`${API_URL}/admin/cinemas`)).data.result.find(x => x.name === c.name)?.id;
      
      if (cinemaId) {
        // Create 2 rooms per cinema
        for (let i = 1; i <= 2; i++) {
          const roomRes = await axios.post(`${API_URL}/admin/rooms`, {
            cinemaId, name: `Phòng ${i}`, rowCount: 8, columnCount: 10, type: i === 1 ? 'TWO_D' : 'VIP', status: 'ACTIVE'
          }).catch(e => console.log('Room might exist'));
          
          const roomId = roomRes ? roomRes.data.result.id : (await axios.get(`${API_URL}/admin/rooms?cinemaId=${cinemaId}`)).data.result.find(x => x.name === `Phòng ${i}`)?.id;
          if (roomId) {
            roomIds.push(roomId);
            console.log(`Generating seats for room ${roomId}...`);
            await axios.post(`${API_URL}/admin/rooms/${roomId}/seats/generate`).catch(e => {});
          }
        }
      }
    }

    console.log('Creating foods...');
    for (const f of data.foods) {
      await axios.post(`${API_URL}/admin/foods`, f).catch(e => {});
    }

    console.log('Creating coupons...');
    for (const c of data.coupons) {
      await axios.post(`${API_URL}/admin/coupons`, c).catch(e => {});
    }

    console.log('Creating showtimes...');
    // Create 15 showtimes scattered
    const allMovies = (await axios.get(`${API_URL}/admin/movies`)).data.result.filter(m => m.status === 'NOW_SHOWING');
    let showtimeCount = 0;
    
    for(let m of allMovies) {
        for(let rId of roomIds) {
            if(showtimeCount >= 15) break;
            const hour = 10 + (showtimeCount % 12);
            await axios.post(`${API_URL}/admin/showtimes`, {
                movieId: m.id, roomId: rId,
                startTime: `2026-05-24T${String(hour).padStart(2, '0')}:00:00`,
                endTime: `2026-05-24T${String(hour + 2).padStart(2, '0')}:30:00`,
                normalSeatPrice: 85000, vipSeatPrice: 105000, coupleSeatPrice: 210000, status: 'OPEN'
            }).catch(e => {});
            showtimeCount++;
        }
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err?.response?.data || err.message);
  }
}

seedData();