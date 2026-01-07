import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import UploadDocumentScreen from '../src/screens/UploadDocumentScreen';
import { uploadDocument } from '../src/services/docApiService';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useDocStore } from '../src/store/docStore';

jest.mock('../src/services/docApiService', () => ({
    uploadDocument: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

describe('UploadDocumentScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDocStore.setState({ docs: [] });
        Platform.OS = 'ios';
    });

    describe('rendering', () => {
        it('renders correctly', () => {
            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getByText('upload_document')).toBeTruthy();
            expect(getByText('choose_entry_mode')).toBeTruthy();
            expect(getByText('file_picker')).toBeTruthy();
            expect(getByText('camera')).toBeTruthy();
            expect(getByText('cloud_integrations')).toBeTruthy();
        });

        it('shows dropzone instructions initially', () => {
            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getByText('tap_to_upload')).toBeTruthy();
            expect(getByText('supported_files')).toBeTruthy();
            expect(getByText('browse_files')).toBeTruthy();
        });
    });

    describe('file picking', () => {
        it('calls document picker when file picker button is pressed', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: true
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const filePickerBtn = getByText('file_picker');
            fireEvent.press(filePickerBtn);

            await waitFor(() => {
                expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
            });
        });

        it('shows selected file after picking', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const filePickerBtn = getByText('file_picker');
            fireEvent.press(filePickerBtn);

            await waitFor(() => {
                expect(getByText('test.pdf')).toBeTruthy();
            });
        });

        it('shows upload button after file is selected', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const filePickerBtn = getByText('file_picker');
            fireEvent.press(filePickerBtn);

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });
        });

        it('handles file without mimeType - PDF extension', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://document.pdf',
                    name: 'document.pdf',
                    mimeType: undefined,
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('document.pdf')).toBeTruthy();
            });
        });

        it('handles file without mimeType - PNG extension', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://image.png',
                    name: 'image.png',
                    mimeType: undefined,
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('image.png')).toBeTruthy();
            });
        });

        it('handles file without mimeType - JPG extension', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://photo.jpg',
                    name: 'photo.jpg',
                    mimeType: undefined,
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('photo.jpg')).toBeTruthy();
            });
        });

        it('handles file without mimeType - TXT extension', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://notes.txt',
                    name: 'notes.txt',
                    mimeType: undefined,
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('notes.txt')).toBeTruthy();
            });
        });

        it('handles file without mimeType - unknown extension', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://data.xyz',
                    name: 'data.xyz',
                    mimeType: undefined,
                    file: null
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('data.xyz')).toBeTruthy();
            });
        });
    });

    describe('camera functionality', () => {
        it('requests camera permissions when camera button is pressed', async () => {
            (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
                granted: true
            });
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: true
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const cameraBtn = getByText('camera');
            fireEvent.press(cameraBtn);

            await waitFor(() => {
                expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
            });
        });

        it('shows alert when camera permission is denied', async () => {
            (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
                granted: false
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const cameraBtn = getByText('camera');
            fireEvent.press(cameraBtn);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('camera_permission_required');
            });
        });

        it('launches camera when permissions granted', async () => {
            (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
                granted: true
            });
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://camera_photo.jpg'
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const cameraBtn = getByText('camera');
            fireEvent.press(cameraBtn);

            await waitFor(() => {
                expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
            });
        });

        it('sets file from camera capture', async () => {
            (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
                granted: true
            });
            (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file:///path/to/camera_photo.jpg'
                }]
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('camera'));

            await waitFor(() => {
                expect(getByText('camera_photo.jpg')).toBeTruthy();
            });
        });
    });

    describe('cloud integrations', () => {
        it('shows not implemented alert for cloud integrations', () => {
            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            const cloudBtn = getByText('cloud_integrations');
            fireEvent.press(cloudBtn);

            expect(Alert.alert).toHaveBeenCalledWith('not_implemented', 'func_not_implemented');
        });
    });

    describe('upload functionality', () => {
        it('handles successful upload on native platform', async () => {
            Platform.OS = 'ios';

            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });
            (uploadDocument as jest.Mock).mockResolvedValue({
                status: 200,
                data: { id: 'doc1', title: 'Test Doc' }
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(uploadDocument).toHaveBeenCalled();
                expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', expect.any(Object));
            });
        });

        it('handles upload error with non-200 status', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });
            (uploadDocument as jest.Mock).mockResolvedValue({
                status: 400,
                data: null
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', 'failed_upload');
            });
        });

        it('handles file too large error', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            const error: any = new Error('Invalid server response');
            error.response = { data: '413 Request Entity Too Large' };
            (uploadDocument as jest.Mock).mockRejectedValue(error);

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', 'file_too_large');
            });
        });

        it('handles server error retry message', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            const error: any = new Error('Invalid server response');
            error.response = { data: 'Some other error' };
            (uploadDocument as jest.Mock).mockRejectedValue(error);

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', 'server_error_retry');
            });
        });

        it('handles generic upload error', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            (uploadDocument as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', 'Network error');
            });
        });

        it('handles upload with status 201', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });
            (uploadDocument as jest.Mock).mockResolvedValue({
                status: 201,
                data: { id: 'doc1', title: 'Test Doc' }
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', expect.any(Object));
            });
        });
    });

    describe('file removal', () => {
        it('allows removing selected file', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            const { getByText, queryByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('test.pdf')).toBeTruthy();
            });

            // Remove the file
            const removeBtn = getByText('remove');
            fireEvent.press(removeBtn);

            await waitFor(() => {
                expect(queryByText('test.pdf')).toBeNull();
                expect(getByText('tap_to_upload')).toBeTruthy();
            });
        });
    });

    describe('progress tracking', () => {
        it('tracks upload progress', async () => {
            (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
                canceled: false,
                assets: [{
                    uri: 'file://test.pdf',
                    name: 'test.pdf',
                    mimeType: 'application/pdf',
                    file: null
                }]
            });

            // Mock uploadDocument to call progress callback
            (uploadDocument as jest.Mock).mockImplementation((formData, onProgress) => {
                onProgress(50);
                return Promise.resolve({ status: 200, data: { id: '1' } });
            });

            const { getByText } = render(<UploadDocumentScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.press(getByText('file_picker'));

            await waitFor(() => {
                expect(getByText('upload_selected')).toBeTruthy();
            });

            fireEvent.press(getByText('upload_selected'));

            await waitFor(() => {
                expect(uploadDocument).toHaveBeenCalled();
            });
        });
    });
});
