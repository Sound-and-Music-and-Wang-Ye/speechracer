import torch
import torchaudio
from PIL import Image
import numpy as np
import sys

def img_to_audio(img_path, audio_path):
  spectrogram = img_to_spectrogram(img_path)
  audio = spectrogram_to_audio(spectrogram)
  torchaudio.save(audio_path, audio)

def img_to_spectrogram(img_path):
  img = Image.open(img_path)
  spectrogram = np.array(img)
  spectrogram = torch.tensor(spectrogram).unsqueeze(0)
  return spectrogram

def spectrogram_to_audio(spectrogram):
  audio = torchaudio.transforms.InverseMelScale()(spectrogram)
  return audio
  
if __name__ == '__main__':
  img_path = sys.argv[1]
  audio_path = sys.argv[2]
  img_to_audio(img_path, audio_path)