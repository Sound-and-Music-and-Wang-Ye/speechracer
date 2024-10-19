import torchaudio
import torch
from PIL import Image
import sys
import os
import numpy as np

def audio_to_img(audio_path, img_path, downsample_img_path=None):
	spectrogram = audio_to_spectrogram(audio_path)
	spectrogram = torch.mean(spectrogram, dim=0, keepdim=True)
	spectrogram_to_img(spectrogram, img_path)
	if downsample_img_path:
		pass
		# downsampled_spectrogram = downsample_spectrogram(spectrogram, 2)
		# spectrogram_to_img(downsampled_spectrogram, downsample_img_path)

def audio_to_spectrogram(audio_path):
	audio, sr = torchaudio.load(audio_path)
	spectrogram = torchaudio.transforms.MelSpectrogram(n_fft=2048, n_mels=256, f_min=50, f_max=8000)(audio)
	return spectrogram

def downsample_spectrogram(spectrogram, downsample_factor):
	spectrogram = spectrogram.squeeze(0)
	spectrogram = spectrogram[:, ::downsample_factor]
	spectrogram = spectrogram.unsqueeze(0)
	return spectrogram

def spectrogram_to_img(spectrogram, img_path):
	spectrogram = spectrogram.squeeze(0).numpy()
	# log 10 of the spectrogram
	scaled_spectrum = np.log10(spectrogram + 1)
	print(scaled_spectrum)
	img = Image.fromarray(scaled_spectrum)
	img.save(img_path)

if __name__ == '__main__':
	audio_path = sys.argv[1]
	img_path = sys.argv[2]
	downsample_img_path = sys.argv[3]
	audio_to_img(audio_path, img_path, downsample_img_path)