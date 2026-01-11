/**
 * Upload image to ImgBB and return the hosted URL
 * Free service: https://imgbb.com/
 * 
 * To get API key:
 * 1. Go to https://imgbb.com/
 * 2. Click "Sign up" (free account)
 * 3. Go to https://imgbb.com/account/settings/api
 * 4. Copy your API key and paste it below or in .env file
 */



export async function uploadToImgBB(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('expiration', '15552000'); // 6 months

    // Kirim ke backend, backend yang handle API key dan request ke imgbb
    const response = await fetch('/api/proxy', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend proxy error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to upload image to ImgBB');
    }

    return data.data.url; // Return the hosted URL
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
}
