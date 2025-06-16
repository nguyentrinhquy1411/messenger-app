import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../lib/db.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import dotenv from "dotenv";

dotenv.config();

// Sample programming-related users
const sampleUsers = [
  {
    email: "john.developer@gmail.com",
    username: "johncoder",
    fullName: "John Nguyen",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "alice.frontend@gmail.com",
    username: "alicereact",
    fullName: "Alice Tran",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "mike.backend@gmail.com",
    username: "mikenode",
    fullName: "Mike Le",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "sarah.fullstack@gmail.com",
    username: "sarahfull",
    fullName: "Sarah Pham",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "david.mobile@gmail.com",
    username: "davidmobile",
    fullName: "David Vu",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

// Programming knowledge sharing posts
const samplePosts = [
  {
    content: `🚀 Mới học xong React Hook useEffect! 

Chia sẻ một số tips quan trọng:
1. Luôn cleanup trong useEffect để tránh memory leak
2. Dependency array [] chỉ chạy 1 lần khi component mount
3. Không có dependency array = chạy mỗi lần render

Các bạn có tips nào khác không? 💡

#ReactJS #Frontend #JavaScript`,
    image: null,
  },
  {
    content: `📚 Vừa đọc xong cuốn "Clean Code" của Uncle Bob!

Key takeaways:
- Function nên nhỏ và chỉ làm 1 việc duy nhất
- Tên biến phải có ý nghĩa, đọc như đọc câu chuyện
- Comments tốt nhất là code tự giải thích

Cuốn nào các bạn recommend tiếp theo? 🤔

#CleanCode #Programming #BookRecommendation`,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=300&fit=crop",
  },
  {
    content: `💻 Node.js Performance Tips cho beginners:

1. Sử dụng async/await thay vì callback hell
2. Implement caching với Redis
3. Database indexing cho queries nhanh hơn
4. Sử dụng compression middleware
5. Monitor với tools như PM2

Ai có experience về scaling Node.js app không? Share kinh nghiệm nha! 🔥

#NodeJS #Backend #Performance`,
    image: null,
  },
  {
    content: `🎯 MongoDB vs PostgreSQL - Khi nào dùng gì?

MongoDB tốt cho:
- Rapid prototyping
- Document-based data
- Flexible schema

PostgreSQL tốt cho:
- Complex relationships
- ACID transactions
- Advanced queries

Dự án hiện tại các bạn đang dùng database nào? 🗄️

#Database #MongoDB #PostgreSQL`,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
  },
  {
    content: `⚡ React Native hay Flutter cho mobile app?

Vừa thử cả 2 platforms:

React Native:
✅ JavaScript familiar
✅ Code sharing with web
❌ Performance issues

Flutter:
✅ Great performance
✅ Hot reload amazing
❌ Dart learning curve

Team mobile của các bạn chọn gì? 📱

#ReactNative #Flutter #MobileDevelopment`,
    image: null,
  },
  {
    content: `🔐 Security best practices cho web developers:

1. Luôn validate input ở backend
2. Sử dụng HTTPS everywhere
3. JWT với proper expiration
4. Hash passwords với bcrypt
5. Implement rate limiting
6. Sanitize user data

Security không bao giờ là quá đủ! 🛡️

#WebSecurity #Backend #Frontend`,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
  },
  {
    content: `🎨 CSS Grid vs Flexbox - Khi nào dùng cái nào?

Flexbox cho:
- 1-dimensional layouts
- Navigation bars
- Card alignments

CSS Grid cho:
- 2-dimensional layouts
- Complex page layouts
- Magazine-style designs

Responsive design dễ hơn nhiều với 2 tools này! 💪

#CSS #Frontend #ResponsiveDesign`,
    image: null,
  },
  {
    content: `📊 Học Data Structures & Algorithms có thực sự cần thiết?

Quan điểm cá nhân: CÓ!

Lý do:
- Tư duy logic tốt hơn
- Optimize performance
- Pass technical interviews
- Solve complex problems

Đừng chỉ học syntax, hiểu concepts mới quan trọng! 🧠

#DataStructures #Algorithms #Programming`,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
  },
  {
    content: `🔄 Git workflow cho team development:

1. Feature branches cho mỗi task
2. Pull requests với code review
3. Merge vào develop branch
4. Deploy từ main/master branch
5. Semantic versioning cho releases

Conflict ít hơn, code quality cao hơn! 🌟

#Git #VersionControl #TeamWork`,
    image: null,
  },
  {
    content: `☁️ AWS vs Azure vs Google Cloud?

Vừa deploy app lên cả 3 platforms:

AWS: Ecosystem lớn nhất, documentation tốt
Azure: Integrate tốt với Microsoft stack  
GCP: ML/AI services mạnh, pricing competitive

Free tier của tất cả đều worth trying! 💰

#Cloud #AWS #Azure #GCP #DevOps`,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop",
  },
];

// Sample comments data
const sampleComments = [
  {
    content: "Thanks for sharing! useEffect cleanup rất quan trọng nhưng nhiều người hay quên 🙏",
    replies: [
      { content: "Đúng rồi! Mình từng gặp memory leak vì không cleanup 😅" },
      { content: "Có thể share example về cleanup không bạn?" },
    ],
  },
  {
    content: "Clean Code là bible của programmer! Recommend thêm cuốn 'Refactoring' của Martin Fowler 📖",
    replies: [{ content: "Noted! Thanks for recommendation 👍" }],
  },
  {
    content: "Redis caching thật sự game changer! App của mình nhanh gấp 3 lần 🚀",
    replies: [],
  },
  {
    content: "PostgreSQL FTW! ACID transactions quan trọng cho financial apps 💳",
    replies: [{ content: "MongoDB cũng có transactions từ version 4.0 nhé!" }],
  },
  {
    content: "Flutter performance thật sự ấn tượng, đặc biệt animations rất smooth ✨",
    replies: [],
  },
];

class DataSeeder {
  static async clearDatabase() {
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("✅ Database cleared");
  }

  static async createUsers() {
    console.log("👥 Creating users...");
    const users = [];

    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      users.push(user);
    }

    console.log(`✅ Created ${users.length} users`);
    return users;
  }

  static async createFollowRelationships(users) {
    console.log("🔗 Creating follow relationships...");

    // Create realistic follow relationships
    const followPairs = [
      [0, 1],
      [0, 2],
      [0, 3], // John follows Alice, Mike, Sarah
      [1, 0],
      [1, 3],
      [1, 4], // Alice follows John, Sarah, David
      [2, 0],
      [2, 1],
      [2, 4], // Mike follows John, Alice, David
      [3, 0],
      [3, 1],
      [3, 2], // Sarah follows John, Alice, Mike
      [4, 1],
      [4, 2],
      [4, 3], // David follows Alice, Mike, Sarah
    ];

    for (const [followerIndex, followingIndex] of followPairs) {
      const follower = users[followerIndex];
      const following = users[followingIndex];

      // Add to following list
      if (!follower.following.includes(following._id)) {
        follower.following.push(following._id);
      }

      // Add to followers list
      if (!following.followers.includes(follower._id)) {
        following.followers.push(follower._id);
      }
    }

    // Save all users
    await Promise.all(users.map((user) => user.save()));
    console.log("✅ Follow relationships created");
  }

  static async createPosts(users) {
    console.log("📝 Creating posts...");
    const posts = [];

    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomUser = users[i % users.length];

      const post = new Post({
        user: randomUser._id,
        content: postData.content,
        image: postData.image,
        likes: this.generateRandomLikes(users, randomUser._id),
        comments: this.generateRandomComments(users, i),
        reposts: this.generateRandomReposts(users, randomUser._id),
      });

      await post.save();
      posts.push(post);
    }

    console.log(`✅ Created ${posts.length} posts`);
    return posts;
  }

  static generateRandomLikes(users, authorId) {
    const likes = [];
    const numLikes = Math.floor(Math.random() * (users.length - 1)) + 1;

    const availableUsers = users.filter((user) => user._id.toString() !== authorId.toString());
    const shuffled = availableUsers.sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(numLikes, shuffled.length); i++) {
      likes.push(shuffled[i]._id);
    }

    return likes;
  }

  static generateRandomComments(users, postIndex) {
    const comments = [];
    const comment = sampleComments[postIndex % sampleComments.length];

    if (comment) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const commentObj = {
        user: randomUser._id,
        content: comment.content,
        likes: this.generateRandomLikes(users, randomUser._id).slice(0, 2),
        replies: comment.replies.map((reply) => ({
          user: users[Math.floor(Math.random() * users.length)]._id,
          content: reply.content,
          likes: this.generateRandomLikes(users, randomUser._id).slice(0, 1),
        })),
      };

      comments.push(commentObj);
    }

    return comments;
  }

  static generateRandomReposts(users, authorId) {
    const reposts = [];
    const numReposts = Math.floor(Math.random() * 3);

    const availableUsers = users.filter((user) => user._id.toString() !== authorId.toString());
    const shuffled = availableUsers.sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(numReposts, shuffled.length); i++) {
      reposts.push({
        user: shuffled[i]._id,
      });
    }

    return reposts;
  }
  static async seedDatabase() {
    try {
      console.log("🌱 Starting database seeding...\n");

      // Connect to database
      await connectToDatabase();
      console.log("✅ Connected to database");

      // Clear existing data
      await this.clearDatabase();

      // Create users
      const users = await this.createUsers();

      // Create follow relationships
      await this.createFollowRelationships(users);

      // Create posts with interactions
      const posts = await this.createPosts(users);

      console.log("\n🎉 Database seeding completed successfully!");
      console.log(`📊 Summary:`);
      console.log(`   - Users: ${users.length}`);
      console.log(`   - Posts: ${posts.length}`);
      console.log(
        `   - Total interactions: ${posts.reduce(
          (sum, post) => sum + post.likes.length + post.comments.length + post.reposts.length,
          0
        )}`
      );
    } catch (error) {
      console.error("❌ Seeding failed:", error);
    } finally {
      mongoose.connection.close();
      console.log("🔌 Database connection closed");
    }
  }
}

// Run seeder
DataSeeder.seedDatabase();

export default DataSeeder;
