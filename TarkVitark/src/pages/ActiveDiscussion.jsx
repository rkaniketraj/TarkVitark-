import React, { useState } from 'react';
import { User2, Plus } from 'lucide-react';
import LeftSideBar from '../components/LeftSideBar';
import Footer from '../components/Footer';
// adding navigation bar left
function ActiveDiscussion() {
    const [boxes, setBoxes] = useState([
        {
          id: 1,
          title: "Getting Started with React",
          description: "Learn the fundamentals of React and build your first application.",
          author: "Sarah Johnson"
        },
        {
          id: 2,
          title: "Advanced State Management",
          description: "Deep dive into modern state management techniques in React.",
          author: "Mike Chen"
        },
        {
          id: 3,
          title: "React Performance Tips",
          description: "Optimize your React applications for better performance.",
          author: "Alex Thompson"
        }
      ]);
    
      const addNewBox = () => {
        const topics = [
          "React Hooks Deep Dive",
          "Building Custom Components",
          "CSS-in-JS Solutions",
          "Testing React Applications",
          "React Router Mastery",
          "Context API vs Redux"
        ];
        
        const descriptions = [
          "Explore advanced use cases of React Hooks in modern applications.",
          "Learn to build reusable and scalable React components.",
          "Compare different styling approaches in React applications.",
          "Master testing strategies for React components and hooks.",
          "Advanced routing techniques for React applications.",
          "Choose the right state management solution for your needs."
        ];
    
        const authors = [
          "Emily Davis",
          "Chris Wilson",
          "David Miller",
          "Lisa Wang",
          "James Smith",
          "Anna Brown"
        ];
    
        const randomIndex = Math.floor(Math.random() * topics.length);
        
        const newBox = {
          id: boxes.length + 1,
          title: topics[randomIndex],
          description: descriptions[randomIndex],
          author: authors[randomIndex]
        };
    
        setBoxes([...boxes, newBox]);
      };
    
      return (
        <div className="min-h-screen bg-gray-50">
          <LeftSideBar />
          
          <div className="lg:ml-64">
            <main className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Discussion Topics</h1>
                <button
                  onClick={addNewBox}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add New Topic
                </button>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
                {boxes.map(box => (
                  <div 
                    key={box.id}
                    className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-all hover:shadow-lg"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {box.title}
                      </h3>
                      
                      <p className="text-gray-600">
                        {box.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2">
                          <User2 className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">{box.author}</span>
                        </div>
                        
                        <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Live
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
            
            <Footer />
          </div>
        </div>
      );
    }

export default ActiveDiscussion;