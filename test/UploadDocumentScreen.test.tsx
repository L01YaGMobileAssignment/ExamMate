import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UploadDocumentScreen from '../src/screens/UploadDocumentScreen';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { uploadDocument } from '../src/services/docApiService';
import { Alert } from 'react-native';

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

// Mock dependencies
jest.mock('expo-document-picker', () => ({
    getDocumentAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    launchCameraAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('../src/services/docApiService', () => ({
    uploadDocument: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('UploadDocumentScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

        expect(getByText('upload_document')).toBeTruthy();
        expect(getByText('file_picker')).toBeTruthy();
        expect(getByText('camera')).toBeTruthy();
        expect(getByText('cloud_integrations')).toBeTruthy();
    });

    it('handles document selection and upload', async () => {
        (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{
                uri: 'file://test.pdf',
                name: 'test.pdf',
                mimeType: 'application/pdf',
                file: {} // Web file object mock if needed
            }]
        });

        (uploadDocument as jest.Mock).mockResolvedValue({
            status: 200,
            data: { id: 1, title: 'test.pdf' }
        });

        const { getByText, queryByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

        // Select file
        fireEvent.press(getByText('file_picker'));

        await waitFor(() => {
            expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
            expect(getByText('test.pdf')).toBeTruthy();
        });

        // Upload
        const uploadBtn = getByText('upload_selected');
        fireEvent.press(uploadBtn);

        await waitFor(() => {
            expect(uploadDocument).toHaveBeenCalled();
            // It navigates to DocumentDetail
            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', expect.objectContaining({
                document: expect.objectContaining({ title: 'test.pdf' })
            }));
        });
    });

    it('handles camera selection', async () => {
        (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
        (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'file://camera.jpg' }]
        });

        const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

        fireEvent.press(getByText('camera'));

        await waitFor(() => {
            expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
            expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
            // Check if file name from URI is displayed (camera_upload.jpg or similar split logic)
            expect(getByText('camera.jpg')).toBeTruthy();
        });
    });

    it('handles camera permission denied', async () => {
        (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });

        const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

        fireEvent.press(getByText('camera'));

        await waitFor(() => {
            expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
            expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('camera_permission_required');
        });
    });
});

