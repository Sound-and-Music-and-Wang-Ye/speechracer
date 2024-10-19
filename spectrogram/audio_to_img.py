import torchaudio
from PIL import Image
import sys

def audio_to_img(audio_path, img_path, downsample_img_path=None):
	spectrogram = audio_to_spectrogram(audio_path)
	downsampled_spectrogram = downsample_spectrogram(spectrogram, 2)
	spectrogram_to_img(spectrogram, img_path)
	if downsample_img_path:
		spectrogram_to_img(downsampled_spectrogram, downsample_img_path)

def audio_to_spectrogram(audio_path):
	audio, sr = torchaudio.load(audio_path)
	spectrogram = torchaudio.transforms.MelSpectrogram()(audio)
	return spectrogram

def downsample_spectrogram(spectrogram, downsample_factor):
	spectrogram = spectrogram.squeeze(0)
	spectrogram = spectrogram[:, ::downsample_factor]
	spectrogram = spectrogram.unsqueeze(0)
	return spectrogram

def spectrogram_to_img(spectrogram, img_path):
	spectrogram = spectrogram.squeeze(0).numpy()
	img = Image.fromarray(spectrogram)
	img.save(img_path)

if __name__ == '__main__':
	audio_path = sys.argv[1]
	img_path = sys.argv[2]
	downsample_img_path = sys.argv[3]
	audio_to_img(audio_path, img_path, downsample_img_path)