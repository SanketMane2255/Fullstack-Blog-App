import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';

const BlogDetails = () => {

    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:4000/api/blog/getSpecificBlog/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,  
                      },
                })
                //console.log(response.data)
                setBlog(response.data)

            } catch (err) {
                    setError('Failed to fetch blog')
            }
        }
        fetchBlog()
    },[id]);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
      }
    
      if (!blog) {
        return <div>Loading...</div>;
      }

    return (
        <div className="text-center m-5 p-5" >
        <div className='border border-4 border-dark shadow-2 rounded w-75 mx-auto p-3 'style={{backgroundColor:"aliceblue"}} >
     <Card>
       <Card.Body>
         <Card.Title className='fw-bold fs-4'>{blog.title}</Card.Title>
         <Card.Subtitle className="mb-2 text-muted">By {blog.author.name}</Card.Subtitle>
         <Card.Text>{blog.content}</Card.Text>

         {/* Render Images if available */}
         {blog.images && blog.images.length > 0 && (
           <div>
             
             <div className="blog-images">
               
               {blog.images.map((image, index) => (
                    
                 <img
                   key={index}
                   src={`http://localhost:4000/${image}`} // Assuming image URL is relative and served from your backend
                   alt={`Blog imag ${index + 1}`}
                   className="img-fluid mb-3"
                   style={{ maxWidth: '100%', height: 'auto' }}
                 />
               ))}
             </div>
           </div>
         )}

         <div>
           <p>Likes</p> {blog.likes.length}
         </div>

         <h5 className="mt-4">Comments:</h5>
         {blog.comments && blog.comments.length > 0 ? (
           
           <ListGroup>
             {blog.comments.map((comment, index) => (
               <ListGroup.Item key={index}>
                 <strong>{comment.user?.name}</strong>: {comment.comment}
               </ListGroup.Item>
             ))}
           </ListGroup>
         ) : (
           <div>No comments yet.</div>
         )}
       </Card.Body>
     </Card>
   </div><br/><br/><br/><br/><br/><br/><br/>
   </div>
    )
}

export default BlogDetails