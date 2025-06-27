// import React, { useState } from 'react';
// import { Plus } from 'lucide-react';
// import Navbar from '../components/Navbar';
// import LeftSideBar from '../components/LeftSideBar';
// import Footer from '../components/Footer';
// import Box from '../components/ActiveBox'; 
//  import { useNavigate } from 'react-router-dom';
// //import { useNavie } from 'react-router-dom';

// function ActiveDiscussion() {
//   const navigate = useNavigate(); 
//   const handleBoxClick = (box) => {
//     navigate('/discuss', {
//       state: {
//         title: box.title,
//         description: box.description,
//         author: box.author
//       }
//     });
//   }
//   const [boxes, setBoxes] = useState([
//     {
//       id: 1,
//       title: "Getting Started with React",
//       description: "Learn the fundamentals of React and build your first application.",
//       author: "Sarah Johnson"
//     },
//     {
//       id: 2,
//       title: "Advanced State Management",
//       description: "Deep dive into modern state management techniques in React.",
//       author: "Mike Chen"
//     },
//     {
//       id: 3,
//       title: "React Performance Tips",
//       description: "Optimize your React applications for better performance.",
//       author: "Alex Thompson"
//     }
//   ]);

//   const addNewBox = () => {
//     const topics = [
//       "React Hooks Deep Dive",
//       "Building Custom Components",
//       "CSS-in-JS Solutions",
//       "Testing React Applications",
//       "React Router Mastery",
//       "Context API vs Redux"
//     ];
    
//     const descriptions = [
//       "Explore advanced use cases of React Hooks in modern applications.",
//       "Learn to build reusable and scalable React components.",
//       "Compare different styling approaches in React applications.",
//       "Master testing strategies for React components and hooks.",
//       "Advanced routing techniques for React applications.",
//       "Choose the right state management solution for your needs."
//     ];

//     const authors = [
//       "Emily Davis",
//       "Chris Wilson",
//       "David Miller",
//       "Lisa Wang",
//       "James Smith",
//       "Anna Brown"
//     ];

//     const randomIndex = Math.floor(Math.random() * topics.length);
    
//     const newBox = {
//       id: boxes.length + 1,
//       title: topics[randomIndex],
//       description: descriptions[randomIndex],
//       author: authors[randomIndex]
//     };

//     setBoxes([...boxes, newBox]);
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="fixed top-0 w-full z-50">
//         <Navbar />
//       </div>

//       <div className="flex flex-col flex-grow">
//         <div className="flex pt-16">
//           <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
//             <LeftSideBar />
//           </div>

//           <div className="flex-1 ml-64 p-8 min-h-screen">
//             <div className="max-w-7xl mx-auto">
//               <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-2xl font-bold text-gray-800">Discussion Topics</h1>
//                 <button
//                   onClick={addNewBox}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Plus size={20} />
//                   Add New Topic
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {boxes.map(box => (
//                   <Box 
//                     key={box.id} 
//                     title={box.title}
//                     description={box.description}
//                     author={box.author}
//                     onClick={()=>handleBoxClick(box)} 
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="w-full mt-auto bg-gray-800">
//           <div className="w-full max-w-7xl mx-auto py-6 px-8 text-white">
//             <Footer />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ActiveDiscussion;



import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';
import Box from '../components/ActiveBox';
import debateService from '../services/debateService';

function ActiveDiscussion() {
  const navigate = useNavigate();
  const [activeDebates, setActiveDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBoxClick = (debate) => {
    navigate('/discuss', {
      state: {
        title: debate.title,
        description: debate.description,
        author: debate.host?.username || 'Unknown',
      },
    });
  };

  useEffect(() => {
    const fetchActiveDebates = async () => {
      try {
        const data = await debateService.getActiveDebates();
        setActiveDebates(data);
      } catch (error) {
        console.error('Error fetching active debates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDebates();

    // Optional: Auto-refresh every 60 seconds
    const interval = setInterval(fetchActiveDebates, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex pt-16">
          {/* Sidebar */}
          <div className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
            <LeftSideBar />
          </div>

          {/* Main Area */}
          <div className="flex-1 ml-64 p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Active Discussions</h1>
                {/* Optional Add Button */}
                <button
                  onClick={() => {}}
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  title="Debates can only be started from the Host page"
                >
                  <Plus size={20} />
                  Add New Topic
                </button>
              </div>

              {loading ? (
                <div className="text-center text-gray-500">Loading active discussions...</div>
              ) : activeDebates.length === 0 ? (
                <div className="text-center text-gray-500">No active debates right now.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDebates.map((debate) => (
                    <Box
                      key={debate._id}
                      title={debate.title}
                      description={debate.description}
                      author={debate.host?.username || 'Unknown'}
                      onClick={() => handleBoxClick(debate)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full mt-auto bg-gray-800">
          <div className="w-full max-w-7xl mx-auto py-6 px-8 text-white">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveDiscussion;

