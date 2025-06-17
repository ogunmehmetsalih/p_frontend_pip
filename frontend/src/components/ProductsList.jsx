import ProductsSection from './ProductsSection';
import Navbar from './Navbar';
import Footer from './Footer';
export default function ProductsList(){
    return (
    <div className="bg-white min-h-screen text-black">
      <Navbar/>
            
      
      <ProductsSection/>
      {/* Footer */}
      <Footer/>
    </div>
  );
}