import * as faceapi from 'face-api.js';

let modelsLoaded = false;

/**
 * Initialize face-api.js models
 * This is completely FREE and requires NO API keys!
 */
export const initFaceAPI = async () => {
    if (modelsLoaded) return true;
    
    try {
        // Load models from CDN (free and fast)
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        modelsLoaded = true;
        console.log('✅ Face recognition models loaded successfully!');
        return true;
    } catch (error) {
        console.error('❌ Failed to load face recognition models:', error);
        throw new Error('Failed to initialize face recognition. Please check your internet connection.');
    }
};

/**
 * Generate unique face ID from descriptor
 * @param {Array} descriptor - Face descriptor array
 * @returns {string} Unique face ID
 */
const generateFaceId = (descriptor) => {
    // Create hash from descriptor
    const hash = descriptor.reduce((acc, val) => acc + val, 0);
    const timestamp = Date.now();
    return `FACE-${timestamp}-${Math.abs(hash).toString(36).toUpperCase()}`;
};

/**
 * Capture face from video and generate descriptor
 * @param {HTMLVideoElement} videoElement - Video element with camera stream
 * @returns {Promise<Object>} Face descriptor data
 */
export const enrollFace = async (videoElement) => {
    try {
        // Validate video element
        if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
            return {
                success: false,
                error: 'Video not ready. Please ensure camera is started and video is playing.'
            };
        }

        await initFaceAPI();
        
        // Detect face with landmarks and descriptor
        const detection = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        
        if (!detection) {
            return {
                success: false,
                error: 'No face detected. Please ensure your face is clearly visible and well-lit.'
            };
        }
        
        // Generate unique ID and store descriptor
        const faceDescriptor = Array.from(detection.descriptor);
        const faceId = generateFaceId(faceDescriptor);
        
        return {
            success: true,
            faceId: faceId,
            descriptor: faceDescriptor,
            confidence: detection.detection.score
        };
    } catch (error) {
        console.error('Face Enrollment Error:', error);
        return {
            success: false,
            error: error.message || 'Face enrollment failed. Please try again.'
        };
    }
};

/**
 * Authenticate face by comparing with stored descriptors
 * @param {HTMLVideoElement} videoElement - Video element with camera stream
 * @param {Array} storedDescriptors - Array of stored face descriptors with member info
 * @returns {Promise<Object>} Authentication result
 */
export const authenticateFace = async (videoElement, storedDescriptors) => {
    try {
        // Validate video element
        if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
            return {
                success: false,
                error: 'Video not ready. Please ensure camera is started and video is playing.'
            };
        }

        await initFaceAPI();
        
        // Detect face
        const detection = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        
        if (!detection) {
            return {
                success: false,
                error: 'No face detected. Please ensure your face is clearly visible.'
            };
        }
        
        // Compare with stored descriptors
        const currentDescriptor = detection.descriptor;
        let bestMatch = null;
        let bestDistance = 0.6; // Threshold for matching (lower = stricter)
        
        console.log('🔍 Starting face matching...');
        console.log('📊 Total enrolled faces:', storedDescriptors.length);
        
        for (const stored of storedDescriptors) {
            const distance = faceapi.euclideanDistance(
                currentDescriptor,
                new Float32Array(stored.descriptor)
            );
            
            console.log(`👤 Checking ${stored.member.firstname} ${stored.member.lastname} (ID: ${stored.member.student_id})`);
            console.log(`   Distance: ${distance.toFixed(4)} (threshold: ${bestDistance})`);
            
            if (distance < bestDistance) {
                console.log(`   ✅ NEW BEST MATCH! Previous: ${bestMatch?.member?.firstname || 'none'}`);
                bestDistance = distance;
                bestMatch = stored;
            } else {
                console.log(`   ❌ Not a match (distance too high)`);
            }
        }
        
        if (bestMatch) {
            console.log('🎯 FINAL MATCH:', bestMatch.member.firstname, bestMatch.member.lastname);
            console.log('📍 Student ID:', bestMatch.member.student_id);
            console.log('🎲 Face ID:', bestMatch.faceId);
            console.log('📏 Final Distance:', bestDistance.toFixed(4));
            
            return {
                success: true,
                member: bestMatch.member,
                faceId: bestMatch.faceId,
                confidence: 1 - bestDistance,
                distance: bestDistance
            };
        } else {
            console.log('❌ No match found - all distances above threshold');
            return {
                success: false,
                error: 'Face not recognized. Please register your face first.'
            };
        }
    } catch (error) {
        console.error('Face Authentication Error:', error);
        return {
            success: false,
            error: error.message || 'Face authentication failed. Please try again.'
        };
    }
};

/**
 * Start camera stream
 * @param {HTMLVideoElement} videoElement - Video element to attach stream
 * @returns {Promise<MediaStream>} Camera stream
 */
export const startCamera = async (videoElement) => {
    try {
        if (!videoElement) {
            throw new Error('Video element is not available');
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        videoElement.srcObject = stream;
        
        // Wait for video to be ready
        return new Promise((resolve, reject) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play()
                    .then(() => resolve(stream))
                    .catch(reject);
            };
            videoElement.onerror = reject;
        });
    } catch (error) {
        console.error('Camera Error:', error);
        throw new Error('Failed to access camera. Please grant camera permissions.');
    }
};

/**
 * Stop camera stream
 * @param {MediaStream} stream - Camera stream to stop
 */
export const stopCamera = (stream) => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
};

/**
 * Delete face data (for compatibility)
 * @param {string} faceId - Face ID to delete
 * @returns {Promise<Object>}
 */
export const deleteFace = async (faceId) => {
    // This is handled on the backend
    return {
        success: true,
        message: 'Face data will be removed from database'
    };
};

export default {
    initFaceAPI,
    enrollFace,
    authenticateFace,
    startCamera,
    stopCamera,
    deleteFace
};
